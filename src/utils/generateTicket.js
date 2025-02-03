import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

const generateTicketPDF = async (conference, presenter) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Conference: ${conference.title}`, {
        x: 50,
        y: 350,
        size: 20,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Presenter: ${presenter.username}`, {
        x: 50,
        y: 300,
        size: 20,
        color: rgb(0, 0, 0),
    });

    const qrCodeDataUrl = await QRCode.toDataURL(`Conference ID: ${conference._id}\nPresenter: ${presenter.username}`);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    page.drawImage(qrImage, {
        x: 50,
        y: 150,
        width: 200,
        height: 200,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ticket.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default generateTicketPDF;
