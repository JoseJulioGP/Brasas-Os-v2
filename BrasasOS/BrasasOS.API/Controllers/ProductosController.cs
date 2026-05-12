using BrasasOS.API.Services;
using BrasasOS.Models;
using Microsoft.AspNetCore.Mvc;
using Supabase;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly Supabase.Client _supabase;

    public ProductosController(Supabase.Client supabase)
    {
        _supabase = supabase;
    }

    [HttpGet]
    public async Task<IActionResult> GetProductos()
    {
        var result = await _supabase.From<Producto>().Get();
        return Ok(result.Models);
    }

    [HttpPost("vender/{id}")]
    public async Task<IActionResult> VenderProducto(long id, [FromBody] int cantidad)
    {
        var service = new InventarioService(_supabase);
        var exito = await service.ReducirStock(id, cantidad);

        if (!exito) return BadRequest("No hay stock suficiente o el producto no existe.");

        return Ok("Venta procesada y stock actualizado.");
    }
}