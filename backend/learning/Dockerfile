FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

ARG configuration=Release
ENV DOTNET_CONFIGURATION=$configuration

COPY ["Learning/Learning.csproj", "Learning/"]
RUN dotnet restore "Learning/Learning.csproj"
COPY . .
WORKDIR "/src/Learning"
RUN dotnet publish "Learning.csproj" -c $DOTNET_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

USER app

ENTRYPOINT ["dotnet", "Learning.dll"]