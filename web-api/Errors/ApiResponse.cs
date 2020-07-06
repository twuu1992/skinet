using System;

namespace web_api.Errors
{
    public class ApiResponse
    {
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode();
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }

        private string GetDefaultMessageForStatusCode()
        {
            return StatusCode switch
            {
                400 => "A bad request you have made",
                401 => "You are not authorized",
                404 => "Resource is not found",
                500 => "Errors",
                _ => null
            };
        }
    }
}