#!/bin/bash

# View Sallar Foundation Application Logs
echo "📝 Sallar Foundation Logs"
echo "========================"

# Function to show logs for a service
show_logs() {
    local service=$1
    local lines=${2:-50}
    
    echo ""
    echo "--- $service Logs (last $lines lines) ---"
    if [ "$NODE_ENV" = "production" ]; then
        docker-compose -f docker-compose.prod.yml logs --tail=$lines $service 2>/dev/null || echo "$service not running"
    else
        docker-compose logs --tail=$lines $service 2>/dev/null || echo "$service not running"
    fi
}

# Check command line arguments
case "$1" in
    "backend"|"api")
        show_logs backend ${2:-100}
        ;;
    "frontend"|"web")
        show_logs frontend ${2:-100}
        ;;
    "mysql"|"database"|"db")
        show_logs mysql ${2:-100}
        ;;
    "all"|"")
        show_logs backend 30
        show_logs frontend 30
        show_logs mysql 30
        ;;
    "follow"|"tail"|"-f")
        echo "Following all logs (Ctrl+C to stop)..."
        if [ "$NODE_ENV" = "production" ]; then
            docker-compose -f docker-compose.prod.yml logs -f
        else
            docker-compose logs -f
        fi
        ;;
    *)
        echo "Usage: $0 [service] [lines]"
        echo ""
        echo "Services:"
        echo "  backend, api     - Backend API logs"
        echo "  frontend, web    - Frontend web server logs"
        echo "  mysql, db        - Database logs"
        echo "  all              - All service logs (default)"
        echo "  follow, tail, -f - Follow all logs in real-time"
        echo ""
        echo "Examples:"
        echo "  $0                    # Show last 30 lines of all services"
        echo "  $0 backend           # Show last 100 lines of backend"
        echo "  $0 frontend 200      # Show last 200 lines of frontend"
        echo "  $0 follow            # Follow all logs in real-time"
        ;;
esac
