namespace ServiceDesk.Models;

public enum TicketStatus { Open, InProgress, Resolved, Closed }
public enum TicketPriority { Low, Medium, High, Critical }

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Requester { get; set; } = "";
    public TicketPriority Priority { get; set; } = TicketPriority.Medium;
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public DateTime Created { get; set; } = DateTime.Now;

    public string Summary => $"#{Id} · {Priority} · {Status}";
}
