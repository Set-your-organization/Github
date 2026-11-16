using ServiceDesk.Services;
using ServiceDesk.Views;

namespace ServiceDesk;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.UseMauiApp<App>();
        builder.Services.AddSingleton<TicketService>();
        builder.Services.AddTransient<TicketListPage>();
        builder.Services.AddTransient<NewTicketPage>();
        builder.Services.AddTransient<TicketDetailPage>();
        return builder.Build();
    }
}
