"""
This tiny script subscribes to the Redis `booking.created` channel and prints
incoming messages.  Run it with Python while Redis is running and the
bookings service publishes booking.created events.

Example usage:

    python3 listen_booking_created.py --host localhost --port 6379
"""
import argparse
import redis

def main(host: str, port: int):
    client = redis.Redis(host=host, port=port)
    pubsub = client.pubsub()
    pubsub.subscribe('booking.created')
    print(f"Subscribed to 'booking.created' on {host}:{port}")
    for message in pubsub.listen():
        # Ignore subscription confirmations
        if message['type'] != 'message':
            continue
        data = message['data']
        try:
            decoded = data.decode('utf-8')
        except Exception:
            decoded = str(data)
        print(f"booking.created => {decoded}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Listen for booking.created events from Redis.')
    parser.add_argument('--host', default='localhost', help='Redis host (default: localhost)')
    parser.add_argument('--port', type=int, default=6379, help='Redis port (default: 6379)')
    args = parser.parse_args()
    try:
        main(args.host, args.port)
    except KeyboardInterrupt:
        print('Exiting...')
