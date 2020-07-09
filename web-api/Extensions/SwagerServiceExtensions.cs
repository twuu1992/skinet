using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace web_api.Extensions
{
    public static class SwagerServiceExtensions
    {
        public static IServiceCollection AddSwagerDocumentation(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "SkiNet API", Version = "v1" });
                });
            return services;
        }

        public static IApplicationBuilder UseSwagerDocumentation(this IApplicationBuilder app)
        {
            app.UseSwagger();

            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "SkiNet API v1"); });

            return app;
        }
    }
}