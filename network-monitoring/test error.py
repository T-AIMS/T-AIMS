def check_device_test(ip):
    try:
        raise ValueError("Simulasi kesalahan untuk pengujian")
    except Exception as error:
        status = "ERROR"
        response_time_ms = None
        print(f"Kesalahan saat memeriksa {ip}: {error}")

    return status, response_time_ms


print("=== PENGUJIAN STATUS ERROR ===")

ip = "192.0.2.1"
status, response_time_ms = check_device_test(ip)

print(f"IP Address: {ip}")
print(f"Status: {status}")
print(f"Response Time: {response_time_ms}") 