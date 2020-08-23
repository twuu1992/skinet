using System.Threading.Tasks;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace web_api.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);

            return Ok(basket ?? new CustomerBasket(id));
        }
        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket customerBasket)
        {
            var updateBasket = await _basketRepository.UpdateBasketAsync(customerBasket);
            return Ok(updateBasket);
        }

        [HttpDelete]
        public async Task DeleteBasket(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);
        }
    }
}