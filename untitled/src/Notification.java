abstract class Notification {
    protected MessageSender sender; // The Bridge connection [cite: 101, 110]

    public Notification(MessageSender sender) {
        this.sender = sender;
    }

    abstract void notify(String message);
}