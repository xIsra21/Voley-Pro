import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Opcional: Registrar una fuente si quieres salir de la estándar
Font.register({
  family: 'Helvetica-Bold',
  src: 'https://fonts.gstatic.com/s/helveticaneue/v70/normal.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#fff'
  },
  header: {
    marginBottom: 30,
    borderBottom: '3 solid #000',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  invoiceInfo: {
    textAlign: 'right',
    fontSize: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    backgroundColor: '#000',
    color: '#fff',
    padding: 5,
    width: '150px'
  },
  // Estilos de la Tabla
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    alignItems: 'center',
    height: 30
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
    borderBottom: '2 solid #000'
  },
  // Columnas
  colDesc: { width: '60%', paddingLeft: 5 },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '25%', textAlign: 'right', paddingRight: 5 },
  
  textSmall: { fontSize: 10 },
  textBold: { fontWeight: 'bold' },

  totalSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  totalBox: {
    width: '180px',
    border: '2 solid #000',
    padding: 10,
    backgroundColor: '#f1a90f' // El color de acento de tu marca
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #ccc',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 9,
    color: '#666'
  }
});

export function CarritoPdf({ productos, total }) {
  const fecha = new Date().toLocaleDateString();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>VOLEY-PRO</Text>
            <Text style={styles.textSmall}>Equipamiento Deportivo Profesional</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.textBold}>Resumen de Pedido</Text>
            <Text>Fecha: {fecha}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>DETALLES</Text>

        {/* Tabla de Productos */}
        <View style={styles.table}>
          {/* Cabecera Tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.colDesc, styles.textSmall, styles.textBold]}>Producto</Text>
            <Text style={[styles.colQty, styles.textSmall, styles.textBold]}>Cant.</Text>
            <Text style={[styles.colPrice, styles.textSmall, styles.textBold]}>Subtotal</Text>
          </View>

          {/* Filas */}
          {productos.map((p, index) => (
            <View key={p.producto.id || index} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.textSmall}>{p.producto.nombre}</Text>
              </View>
              <Text style={[styles.colQty, styles.textSmall]}>{p.cantidad}</Text>
              <Text style={[styles.colPrice, styles.textSmall]}>
                {(p.producto.precio * p.cantidad).toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        {/* Sección Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>TOTAL:</Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{total.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Gracias por confiar en Voley-Pro para tu equipamiento.</Text>
          <Text>Este documento es un resumen informativo de tu carrito de compra.</Text>
        </View>
      </Page>
    </Document>
  );
}