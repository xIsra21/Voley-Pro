// CarritoPdf.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center'
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottom: '1 solid #ccc',
    paddingBottom: 4
  },
  total: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'right'
  }
});

export function CarritoPdf({ productos, total }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Resumen de Compra</Text>

        {productos.map(p => (
          <View key={p.producto.id} style={styles.item}>
            <Text>
              {p.cantidad}x {p.producto.nombre}
            </Text>
            <Text>
              {(p.producto.precio * p.cantidad).toFixed(2)} €
            </Text>
          </View>
        ))}

        <Text style={styles.total}>
          TOTAL: {total.toFixed(2)} €
        </Text>
      </Page>
    </Document>
  );
}