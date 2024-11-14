// import React from 'react';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     padding: 10,
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//     backgroundColor: '#f3f3f3',
//     borderRadius: 10,
//     padding: 5,
//   },
//   table: {
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//     width: '100%',
//     marginBottom: 10,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableCell: {
//     borderStyle: 'solid',
//     borderWidth: 1,
//     borderColor: '#000',
//     padding: 5,
//   },
// });

// const Show_Pdf = ({ get_orderInfo }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>Personal Information</Text>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCell}>
//               <Text>Challan No:</Text>
//             </View>
//             <View style={styles.tableCell}>
//               <Text>{get_orderInfo.challan_no}</Text>
//             </View>
//           </View>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCell}>
//               <Text>Order Date:</Text>
//             </View>
//             <View style={styles.tableCell}>
//               <Text>{`${new Date(get_orderInfo.order_date).getDate()}/${new Date(get_orderInfo.order_date).getMonth()}/${new Date(get_orderInfo.order_date).getFullYear()}`}</Text>
//             </View>
//           </View>
//           {/* Add more rows as needed */}
//         </View>
//         {/* Add more sections for Zula Information and Other Information */}
//       </View>
//     </Page>
//   </Document>
// );

// export default Show_Pdf;



// import React from 'react';
// import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     padding: 10,
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   title: {
//     fontSize: 16,
//     marginBottom: 10,
//     textAlign: 'center',
//     backgroundColor: '#f3f3f3',
//     borderRadius: 10,
//     padding: 5,
//   },
//   table: {
//     borderWidth: 1,
//     borderColor: '#000',
//     width: '100%',
//     marginBottom: 10,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   tableCell: {
//     borderWidth: 1,
//     borderColor: '#000',
//     padding: 5,
//   },
// });

// const Show_Pdf = ({ get_orderInfo }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text style={styles.title}>Personal Information</Text>
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCell}>
//               <Text>Challan No:</Text>
//             </View>
//             <View style={styles.tableCell}>
//               <Text>{get_orderInfo.challan_no}</Text>
//             </View>
//           </View>
//           <View style={styles.tableRow}>
//             <View style={styles.tableCell}>
//               <Text>Order Date:</Text>
//             </View>
//             <View style={styles.tableCell}>
//               <Text>{`${new Date(get_orderInfo.order_date).toLocaleDateString()}`}</Text>
//             </View>
//           </View>
//           {/* Add more rows as needed */}
//         </View>
//         {/* Add more sections for Zula Information and Other Information */}
//       </View>
//     </Page>
//   </Document>
// );

// export default Show_Pdf;



import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';

// Worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Show_Pdf = ({ objectData }) => {
  const [pdf, setPdf] = useState(null);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(objectData), 10, 10); // Convert object data to string and add to PDF
    const pdfOutput = doc.output('blob');
    setPdf(pdfOutput);
  };

  return (
    <div>
      <button onClick={generatePdf}>Generate PDF</button>
      {pdf && (
        <div style={{ width: '100%', height: '500px' }}>
          <Document file={pdf}>
            <Page pageNumber={1} width={600} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default Show_Pdf;
