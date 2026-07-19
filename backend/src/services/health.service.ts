class HealthService {
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }
}

export default new HealthService();
