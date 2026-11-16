using ServiceDesk.Models;

namespace ServiceDesk.Services;

// In-memory store; replace with a database or API for real use.
public class TicketService
{
    private readonly List<Ticket> _tickets = new();
    private int _nextId = 1;

    public TicketService()
    {
        Add(new Ticket { Title = "Cannot connect to VPN", Description = "VPN times out on login.", Requester = "Alice", Priority = TicketPriority.High });
        Add(new Ticket { Title = "Request new monitor", Description = "Need a second monitor.", Requester = "Bob", Priority = TicketPriority.Low });
    }

    public IReadOnlyList<Ticket> GetAll(TicketStatus? status = null) =>
        _tickets.Where(t => status == null || t.Status == status)
                .OrderByDescending(t => t.Created).ToList();

    public Ticket? Get(int id) => _tickets.FirstOrDefault(t => t.Id == id);

    public Ticket Add(Ticket ticket)
    {
        ticket.Id = _nextId++;
        ticket.Created = DateTime.Now;
        _tickets.Add(ticket);
        return ticket;
    }

    public void UpdateStatus(int id, TicketStatus status)
    {
        var t = Get(id);
        if (t != null) t.Status = status;
    }
}
