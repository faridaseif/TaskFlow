//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
void main() {
    MessageSender email = new EmailSender();
    MessageSender adaptedSMS = new SMSAdapter(new OldSMSLibrary());
    Notification n1 = new BasicNotification(email);
    n1.notify("Your order has been received.");
    Notification n2 = new UrgentNotification(adaptedSMS);
    n2.notify("Security breach detected!");
}
