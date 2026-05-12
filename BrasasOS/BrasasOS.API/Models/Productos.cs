using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System;

namespace BrasasOS.Models
{
    [Table("productos")]
    public class Producto : BaseModel
    {
        [PrimaryKey("id", false)]
        public long Id { get; set; }

        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Column("precio")]
        public double Precio { get; set; }

        [Column("stock")]
        public int Stock { get; set; }

        [Column("categoria_id")]
        public long CategoriaId { get; set; }

        [Column("imagen_url")]
        public string? ImagenUrl { get; set; }   
    }
}