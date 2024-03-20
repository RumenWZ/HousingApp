using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WebAPI.Data;
using WebAPI.Helpers;
using WebAPI.Interfaces;
using WebAPI.Middlewares;
using WebAPI.Services;

DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] { "D:\\CSharp\\repos\\env\\HousingApp\\.env" }));

var builder = WebApplication.CreateBuilder(args);

var env = builder.Environment;

var connectionString = env.IsDevelopment() ? Environment.GetEnvironmentVariable("LOCAL_CONNECTION_STRING")
    : Environment.GetEnvironmentVariable("PRODUCTION_CONNECTION_STRING_HOUSINGAPP");

builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

if (env.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    });
}
else if (env.IsProduction())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("ProductionPolicy", builder =>
        {
            builder.WithOrigins(Environment.GetEnvironmentVariable("PRODUCTION_FRONTEND_URL_HOUSINGAPP"))
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
    });
}

builder.Services.AddCors();
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(connectionString);
});
builder.Services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);

builder.Services.AddScoped<IUnitOfWork, UnitOfWork> ();
builder.Services.AddScoped<IPhotoService, PhotoService>();

var secretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
var cloudinaryConfig = builder.Configuration.GetSection("CloudinarySettings");

builder.Services.Configure<CloudinarySettings>(cloudinaryConfig);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(op =>
{
    op.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        IssuerSigningKey = key
    };
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
} else
{
    app.UseCors("ProductionPolicy");
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
