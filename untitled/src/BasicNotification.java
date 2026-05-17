class BasicNotification extends Notification {
    public BasicNotification(MessageSender sender) {
        super(sender);
    }

    @Override
    void notify(String message) {
        sender.sendMessage("[Standard] " + message);
    }
}