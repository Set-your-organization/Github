using ServiceDesk.Views;

namespace ServiceDesk;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();
        Routing.RegisterRoute("newticket", typeof(NewTicketPage));
        Routing.RegisterRoute("ticketdetail", typeof(TicketDetailPage));
    }
}
