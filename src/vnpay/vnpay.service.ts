import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class VnpayService {
    private readonly vnp_TmnCode = process.env.vnp_TmnCode;
    private readonly vnp_HashSecret = process.env.vnp_HashSecret;
    private readonly vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // Sandbox URL, change to production URL for live

    createPaymentUrl(orderId: string, amount: number, returnUrl: string): string {
        const vnp_Params: Record<string, string | number> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.vnp_TmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Payment for order ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100, // amount in VND
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: '127.0.0.1', // Can be dynamic based on the user's IP
            vnp_CreateDate: new Date().toISOString().slice(0, 19).replace(/[-T:]/g, ''),
        };

        vnp_Params.vnp_SecureHashType = 'SHA256';
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac('sha256', this.vnp_HashSecret);
        vnp_Params.vnp_SecureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return `${this.vnp_Url}?${qs.stringify(vnp_Params, { encode: true })}`;
    }

    verifyReturnUrl(query: Record<string, string>): boolean {
        const secureHash = query.vnp_SecureHash;
        delete query.vnp_SecureHash;
        delete query.vnp_SecureHashType;

        const signData = qs.stringify(query, { encode: false });
        const hmac = crypto.createHmac('sha256', this.vnp_HashSecret);
        const hash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        return secureHash === hash;
    }
}
