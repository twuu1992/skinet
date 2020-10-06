using Core.Models.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            // relationships:
            // Order item owns one item ordered
            builder.OwnsOne(oi => oi.ItemOrdered, pio =>
            {
                pio.WithOwner();
            });

            // Price
            // define price type
            builder.Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        }
    }
}