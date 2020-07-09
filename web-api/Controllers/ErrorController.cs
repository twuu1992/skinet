using Microsoft.AspNetCore.Mvc;
using web_api.Errors;

namespace web_api.Controllers
{
    [Route("errors/{code}")]
    public class ErrorController : BaseApiController
    {
        public IActionResult Error(int code)
        {
            return new ObjectResult(new ApiResponse(code));
        }

    }
}