using System;
using Core.Models.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            // relationships:
            // Ship Address
            builder.OwnsOne(o => o.ShipToAddress, a =>
            {
                a.WithOwner();
            });
            // Order Status
            // Convert the Order Status from enum to string
            builder.Property(o => o.Status)
                .HasConversion(
                    os => os.ToString(),
                    os => (OrderStatus)Enum.Parse(typeof(OrderStatus), os)
                );

            // Order items
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        }
    }
}