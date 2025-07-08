import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';


// Register a fallback font for better character support
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

// Define TypeScript interface for the receipt data
interface ReceiptData {
  id: number;
  bahasha_details: {
    card_no: string;
    mhumini_details: {
      first_name: string;
      last_name: string;
      phone_number: string;
      jumuiya_details: {
        name: string;
        church_details: {
          church_name: string;
          church_location: string;
          church_email: string;
          church_phone: string;
        };
      };
    };
  };
  payment_type_details: {
    name: string;
  };
  zaka_amount: string;
  collected_by: string;
  date: string;
}

const mmToPoints = (mm: number) => mm * 2.83465;

// Enhanced styles with better typography and spacing
const styles = StyleSheet.create({
  page: {
    width: mmToPoints(54),
    padding: mmToPoints(2),
    fontFamily: 'Roboto',
  },
  header: {
    textAlign: 'center',
    marginBottom: mmToPoints(3),
  },
  headerTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: mmToPoints(1),
  },
  headerSubtext: {
    fontSize: 6,
    marginBottom: mmToPoints(0.5),
  },
  title: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: mmToPoints(2),
    padding: mmToPoints(1),
    backgroundColor: '#f0f0f0',
  },
  section: {
    marginBottom: mmToPoints(2),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mmToPoints(1),
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 6,
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 6,
    width: '60%',
    textAlign: 'right',
  },
  divider: {
    borderBottom: '0.5 dashed black',
    marginVertical: mmToPoints(1.5),
  },
  amount: {
    marginTop: mmToPoints(1),
    borderTop: '0.5 solid black',
    borderBottom: '0.5 solid black',
    paddingVertical: mmToPoints(1),
  },
  amountText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: mmToPoints(3),
    textAlign: 'center',
    fontSize: 6,
  },
  signature: {
    marginTop: mmToPoints(2),
    borderTopWidth: 0.5,
    borderTopStyle: 'dashed',
    paddingTop: mmToPoints(1),
    textAlign: 'center',
    fontSize: 6,
  },
});

// Format currency
const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(parseFloat(amount));
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ReceiptDocument: React.FC<{ data: ReceiptData }> = ({ data }) => (
  <Document>
    <Page size={[mmToPoints(54), mmToPoints(150)]} style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KANISA KATOLIKI</Text>
        <Text style={styles.headerTitle}>JIMBO KUU LA DAR ES SALAAM</Text>
        <Text style={styles.headerSubtext}>{data?.bahasha_details.mhumini_details.jumuiya_details.church_details.church_name}</Text>
        <Text style={styles.headerSubtext}>{data?.bahasha_details.mhumini_details.jumuiya_details.church_details.church_location}</Text>
        <Text style={styles.headerSubtext}>Simu: {data?.bahasha_details.mhumini_details.jumuiya_details.church_details.church_phone}</Text>
      </View>

      <Text style={styles.title}>STAKABADHI YA MALIPO</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Namba:</Text>
          <Text style={styles.value}>{data?.id.toString().padStart(6, '0')}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tarehe:</Text>
          <Text style={styles.value}>{formatDate(data?.date)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Jina:</Text>
          <Text style={styles.value}>
            {`${data?.bahasha_details.mhumini_details.first_name} ${data?.bahasha_details.mhumini_details.last_name}`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kadi Namba:</Text>
          <Text style={styles.value}>{data?.bahasha_details.card_no}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Jumuiya:</Text>
          <Text style={styles.value}>{data?.bahasha_details.mhumini_details.jumuiya_details.name}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Aina ya Malipo:</Text>
          <Text style={styles.value}>{data?.payment_type_details.name}</Text>
        </View>
      </View>

      <View style={styles.amount}>
        <View style={styles.row}>
          <Text style={styles.amountText}>Kiasi:</Text>
          <Text style={styles.amountText}>{formatCurrency(data?.zaka_amount)}</Text>
        </View>
      </View>

      {/* <View style={styles.signature}>
        <Text>Imekusanywa na:</Text>
        <Text style={{ marginTop: mmToPoints(1) }}>{data?.collected_by}</Text>
      </View> */}

      <View style={styles.footer}>
        <Text>Ahsante kwa kuchangia</Text>
        <Text style={{ marginTop: mmToPoints(1) }}>Mungu akubariki</Text>
      </View>
    </Page>
  </Document>
);


export default ReceiptDocument;

// Main component with TypeScript props
// interface ThermalReceiptProps {
//   data: ReceiptData;
// }

// const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ data }) => {
//   const generatePDF = async () => {
//     const blob = await pdf(<ReceiptDocument data={data} />).toBlob();
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `receipt-${data?.id}-${Date.now()}.pdf`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div>
//       <Button 
//         type="primary" 
//         icon={<DownloadOutlined />} 
//         onClick={generatePDF}
//       >
//         Download Receipt
//       </Button>
      
//       <div style={{ marginTop: 20, height: '500px' }}>
//         <PDFViewer width="100%" height="100%">
//           <ReceiptDocument data={data} />
//         </PDFViewer>
//       </div>
//     </div>
//   );
// };

// export default ThermalReceipt;