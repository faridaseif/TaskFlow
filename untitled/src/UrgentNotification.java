class UrgentNotification extends Notification {
    public UrgentNotification(MessageSender sender) {
        super(sender);
    }

    @Override
    void notify(String message) {
        sender.sendMessage("[PRIORITY!!] " + message.toUpperCase());
    }
}