namespace Core.Models.OrderAggregate
{
    public class Address
    {
        public Address()
        {
        }

        public Address(string street, string city, string state, string postcode)
        {
            Street = street;
            City = city;
            State = state;
            Postcode = postcode;
        }

        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Postcode { get; set; }
    }
}