using ServiceDesk.Models;
using ServiceDesk.Services;

namespace ServiceDesk.Views;

[QueryProperty(nameof(TicketId), "id")]
public partial class TicketDetailPage : ContentPage
{
    private readonly TicketService _service;
    private Ticket? _ticket;
    private bool _loading;

    public string TicketId
    {
        set
        {
            if (int.TryParse(value, out var id)) Load(id);
        }
    }

    public TicketDetailPage(TicketService service)
    {
        InitializeComponent();
        _service = service;
        StatusPicker.ItemsSource = Enum.GetNames<TicketStatus>();
    }

    private void Load(int id)
    {
        _ticket = _service.Get(id);
        if (_ticket == null) return;
        _loading = true;
        TitleLabel.Text = _ticket.Title;
        MetaLabel.Text = $"{_ticket.Summary} · {_ticket.Created:g}";
        RequesterLabel.Text = $"Requested by {_ticket.Requester}";
        DescriptionLabel.Text = _ticket.Description;
        StatusPicker.SelectedIndex = (int)_ticket.Status;
        _loading = false;
    }

    private void OnStatusChanged(object? sender, EventArgs e)
    {
        if (_loading || _ticket == null || StatusPicker.SelectedIndex < 0) return;
        _service.UpdateStatus(_ticket.Id, (TicketStatus)StatusPicker.SelectedIndex);
        MetaLabel.Text = $"{_ticket.Summary} · {_ticket.Created:g}";
    }
}
