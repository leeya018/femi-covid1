
// import React, { useState } from 'react';
// import BarcodeScannerComponent from "react-webcam-barcode-scanner";

// function Test() {

//     const [data, setData] = useState('Not Found');
//     const [active, setActive] = useState(false);

// // 
//     return (
//         <>
//             <button onClick={() => setActive(true)}>Scan Barcodes</button>
//             {active &&
//                 <>
//                     <button onClick={() => setActive(false)}>X</button>
//                     <BarcodeScannerComponent
//                         width={500}
//                         height={500}
//                         onUpdate={(err, result) => {
//                             if (result) {
//                                 setData(result.text)
//                                 setActive(false)
//                             }
//                             else setData('Not Found')
//                         }}
//                     />
//                 </>
//             }
//             <p>{data}</p>
//         </>
//     )
// }

// export default Test;
