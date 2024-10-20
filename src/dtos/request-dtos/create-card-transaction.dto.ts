export class CreateCardTransactionDTO {
    value: number;
    description: string;
    cardNumber: string; // the last 4 digits will be stored
    cardHolderName: string;
    expirationDate: string; // formatted as 'MM/YY'
    cvv: string;
    currency: string;

    setExpirationDate(expirationDate: string): void {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!regex.test(expirationDate)) {
            throw new Error('Invalid expiration date format. Please use \'MM/YY\'.');
        }
        this.expirationDate = expirationDate;
    }
}