using ServiceDesk.Models;
using ServiceDesk.Services;

namespace ServiceDesk.Views;

public partial class TicketListPage : ContentPage
{
    private readonly TicketService _service;

    public TicketListPage(TicketService service)
    {
        InitializeComponent();
        _service = service;
        FilterPicker.ItemsSource = new[] { "All" }.Concat(Enum.GetNames<TicketStatus>()).ToList();
        FilterPicker.SelectedIndex = 0;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        TicketsView.SelectedItem = null;
        Refresh();
    }

    private void Refresh()
    {
        TicketStatus? status = FilterPicker.SelectedIndex > 0 ? (TicketStatus)(FilterPicker.SelectedIndex - 1) : null;
        TicketsView.ItemsSource = _service.GetAll(status);
    }

    private void OnFilterChanged(object? sender, EventArgs e) => Refresh();

    private async void OnNewClicked(object? sender, EventArgs e) => await Shell.Current.GoToAsync("newticket");

    private async void OnTicketSelected(object? sender, SelectionChangedEventArgs e)
    {
        if (e.CurrentSelection.FirstOrDefault() is Ticket t)
            await Shell.Current.GoToAsync($"ticketdetail?id={t.Id}");
    }
}
