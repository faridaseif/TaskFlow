class SMSAdapter implements MessageSender {
    private OldSMSLibrary oldSMS;

    public SMSAdapter(OldSMSLibrary oldSMS) {
        this.oldSMS = oldSMS;
    }

    @Override
    public void sendMessage(String message) {
        oldSMS.sendOldSMS(message);
    }
}