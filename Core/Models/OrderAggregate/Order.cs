using System;
using System.Collections.Generic;

namespace Core.Models.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(string buyerEmail, DeliveryMethod deliveryMethod, Address shipToAddress, IReadOnlyList<OrderItem> orderItems, decimal subtotal, string paymentIntentId)
        {
            PaymentIntentId = paymentIntentId;
            BuyerEmail = buyerEmail;
            DeliveryMethod = deliveryMethod;
            ShipToAddress = shipToAddress;
            OrderItems = orderItems;
            Subtotal = subtotal;
        }

        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public DeliveryMethod DeliveryMethod { get; set; }
        public Address ShipToAddress { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string PaymentIntentId { get; set; }
        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }

    }
}