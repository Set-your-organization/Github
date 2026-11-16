using ServiceDesk.Models;
using ServiceDesk.Services;

namespace ServiceDesk.Views;

public partial class NewTicketPage : ContentPage
{
    private readonly TicketService _service;

    public NewTicketPage(TicketService service)
    {
        InitializeComponent();
        _service = service;
        PriorityPicker.ItemsSource = Enum.GetNames<TicketPriority>();
        PriorityPicker.SelectedIndex = (int)TicketPriority.Medium;
    }

    private async void OnSubmitClicked(object? sender, EventArgs e)
    {
        if (string.IsNullOrWhiteSpace(TitleEntry.Text) || string.IsNullOrWhiteSpace(RequesterEntry.Text))
        {
            await DisplayAlert("Missing details", "Title and your name are required.", "OK");
            return;
        }

        _service.Add(new Ticket
        {
            Title = TitleEntry.Text.Trim(),
            Requester = RequesterEntry.Text.Trim(),
            Description = DescriptionEditor.Text?.Trim() ?? "",
            Priority = (TicketPriority)PriorityPicker.SelectedIndex
        });
        await Shell.Current.GoToAsync("..");
    }
}
