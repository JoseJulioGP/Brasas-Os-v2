using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using Supabase;

var builder = WebApplication.CreateBuilder(args);

// Leer URL y KEY desde appsettings.json
var supabaseUrl = builder.Configuration["https://othadwkcstrtdztqwshg.supabase.co"];
var supabaseKey = builder.Configuration["sb_publishable_lzJAo6QPTcYMcNMmI-a0KQ_skqIgCKw"];

// Registrar el cliente de Supabase para que los controladores puedan usarlo
builder.Services.AddScoped(_ => new Supabase.Client(supabaseUrl, supabaseKey));

builder.Services.AddControllers();

// Configuración de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped(_ =>
    new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoConnectRealtime = true
    }));

var app = builder.Build();

// --- PIPELINE (Configuración de HTTP) ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Importante para que las rutas de los controladores funcionen
app.MapControllers();

app.Run();