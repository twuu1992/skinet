using System;
using System.Collections.Generic;
using Core.Models.OrderAggregate;

namespace web_api.Dtos
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public string DeliveryMethod { get; set; }
        public decimal ShippingPrice { get; set; }
        public Address ShipToAddress { get; set; }
        public IReadOnlyList<OrderItemDto> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
    }
}