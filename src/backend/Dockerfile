# === Stage 1: Runtime Base Image (.NET 9 ASP.NET Core) ===
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

RUN apk add --no-cache sqlite-libs

# === Stage 2: SDK Build Environment ===
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS build
WORKDIR /src

COPY ["Cracow360.Api/Cracow360.Api.csproj", "Cracow360.Api/"]
RUN dotnet restore "Cracow360.Api/Cracow360.Api.csproj"

COPY . .

WORKDIR "/src/Cracow360.Api"
RUN dotnet publish "Cracow360.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# === Stage 3: Optimized Production Container ===
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Cracow360.Api.dll"]
