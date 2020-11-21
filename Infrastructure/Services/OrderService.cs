using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Core.Models.OrderAggregate;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IBasketRepository basketRepository, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            // get basket from repo
            var basket = await _basketRepository.GetBasketAsync(basketId);
            // get items from product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var product = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(product.Id, product.Name, product.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, product.Price, item.Quantity);
                items.Add(orderItem);
            }
            // get delivery method from repo
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            // calculate subtotal
            var subtotal = items.Sum(i => i.Price * i.Quantity);

            // check if order existed
            var spec = new OrderByPaymentIntentIdSpecification(basket.PaymentIntentId);
            var existingOrder = await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);

            if (existingOrder != null)
            {
                _unitOfWork.Repository<Order>().Delete(existingOrder);
            }

            // create order
            var order = new Order(buyerEmail, deliveryMethod, shippingAddress, items, subtotal, basket.PaymentIntentId);
            // save to db
            // TODO:
            _unitOfWork.Repository<Order>().Add(order);
            var result = await _unitOfWork.Complete();

            // nothing return from db
            if (result <= 0) return null;

            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<IReadOnlyList<Order>> GetOdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsOrderingSpecification(buyerEmail);

            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsOrderingSpecification(id, buyerEmail);

            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }
    }
}