/* eslint-disable react/prop-types */
import { Text, View, Page, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  titleContainer: {
    marginTop: 24,
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    color: "3E3E3E",
    marginTop: 20,
  },
  itemsCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 90,
  },
  titleText: {
    textAlign: "center",
    fontSize: 16,
  },
  invoice: {
    fontSize: 16,
  },
  userDetails: {
    fontSize: 10,
  },
  tHeader: {
    marginTop: 20,
    fontSize: 10,
    fontStyle: "bold",
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 20,
    backgroundColor: "#DEDEDE",
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  tbody: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "whitesmoke",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  total: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "whitesmoke",
    borderBottomWidth: 1,
  },
  tbody2: { flex: 2, borderRightWidth: 1 },
  divider: {
    marginTop: 10,
    marginBottom: 10,
    height: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  deliveryTitle: {
    fontSize: 12,
    fontWeight: "extrabold",
  },
});

const gst = 0;
const deliveryCharges = 50;
const platformFee = 10;

// eslint-disable-next-line react/prop-types
const Invoice = ({ order }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <View style={styles.spaceBetween}>
            <Text style={styles.titleText}>Dine-Express</Text>
            <View>
              <Text style={styles.invoice}>Invoice</Text>
              <Text style={styles.userDetails}>Order No: {order?.orderNo}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.spaceBetween}>
          <View>
            <Text style={styles.deliveryTitle}>Delivery From:</Text>
            <Text
              style={styles.userDetails}
            >{`${order.restaurant.name},`}</Text>
            <Text
              style={styles.userDetails}
            >{`${order.restaurant.address},`}</Text>
          </View>
          <View>
            <Text style={styles.deliveryTitle}>Delivery To:</Text>
            <Text
              style={styles.userDetails}
            >{`${order.user.firstName} ${order.user.lastName},`}</Text>
            <Text style={styles.userDetails}>
              {`${order.deliverTo.addressLine1},`}
            </Text>
            <Text style={styles.userDetails}>
              {`${order.deliverTo.addressLine2},`}
            </Text>
            <Text
              style={styles.userDetails}
            >{`${order.deliverTo.city},${order.deliverTo.state},`}</Text>
            <Text
              style={styles.userDetails}
            >{`${order.deliverTo.landmark},${order.deliverTo.pinCode}.`}</Text>
          </View>
        </View>
        <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
          <View style={styles.tHeader}>
            <Text>Items</Text>
          </View>
          <View style={styles.tHeader}>
            <Text>Price</Text>
          </View>
          <View style={styles.tHeader}>
            <Text>Quantity</Text>
          </View>
          <View style={styles.tHeader}>
            <Text>Amount</Text>
          </View>
        </View>
        {order.menuItems.map((item, index) => (
          <View key={index} style={{ width: "100%", flexDirection: "row" }}>
            <View style={styles.tbody}>
              <Text>{item.item.name}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{item.item.price}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{item.quantity}</Text>
            </View>
            <View style={styles.tbody}>
              <Text>{(item.item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        ))}
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={styles.total}>
            <Text></Text>
          </View>
          <View style={styles.total}>
            <Text> </Text>
          </View>
          <View style={styles.tbody}>
            <Text>GST and restaurant charges</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{gst.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={styles.total}>
            <Text></Text>
          </View>
          <View style={styles.total}>
            <Text> </Text>
          </View>
          <View style={styles.tbody}>
            <Text>Delivery partner fee</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{deliveryCharges.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={styles.total}>
            <Text></Text>
          </View>
          <View style={styles.total}>
            <Text> </Text>
          </View>
          <View style={styles.tbody}>
            <Text>Platform fee</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{platformFee.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ width: "100%", flexDirection: "row" }}>
          <View style={styles.total}>
            <Text></Text>
          </View>
          <View style={styles.total}>
            <Text> </Text>
          </View>
          <View style={styles.total}>
            <Text>Total</Text>
          </View>
          <View style={styles.tbody}>
            <Text>{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
