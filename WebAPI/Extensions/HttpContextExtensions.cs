namespace WebAPI.Extensions
{
    public static class HttpContextExtensions
    {
        public static string GetAuthToken(this HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Substring("Bearer ".Length);
            return token;
        }
    }
}
