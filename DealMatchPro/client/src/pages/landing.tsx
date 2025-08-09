import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between p-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-success-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-handshake text-white text-sm"></i>
            </div>
            <span className="font-poppins font-bold text-xl text-primary-900">DealConnect</span>
          </div>
          <Button 
            onClick={handleLogin}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            data-testid="button-login"
          >
            Get Started
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="font-poppins text-5xl lg:text-7xl font-bold text-primary-900 mb-8">
              Transform Your
              <span className="bg-gradient-to-r from-primary-600 to-success-500 bg-clip-text text-transparent"> Business Future</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Smart business acquisition platform where you control the process. Advanced matching technology 
              and streamlined workflows designed for modern entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg"
                onClick={handleLogin}
                className="bg-gradient-to-r from-primary-600 to-success-600 hover:from-primary-700 hover:to-success-700 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                data-testid="button-get-started"
              >
                <i className="fas fa-rocket mr-2"></i>
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2 border-primary-300 text-primary-700 hover:bg-primary-50"
                data-testid="button-watch-demo"
              >
                <i className="fas fa-play mr-2"></i>
                Learn More
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl">
                <div className="text-4xl font-bold text-primary-600 mb-2" data-testid="text-stat-success">94%</div>
                <div className="text-slate-600">Success Rate</div>
              </Card>
              <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl">
                <div className="text-4xl font-bold text-success-600 mb-2" data-testid="text-stat-time">3.2x</div>
                <div className="text-slate-600">Faster Deals</div>
              </Card>
              <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl">
                <div className="text-4xl font-bold text-gold-500 mb-2" data-testid="text-stat-volume">$2.8B</div>
                <div className="text-slate-600">Deal Volume</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-transparent to-success-100/50"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-success-200 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-primary-900 mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced business acquisition platform with smart matching and automated workflows.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 className="font-poppins text-2xl font-semibold text-primary-900 mb-4">Smart Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced matching algorithm analyzes business profiles and buyer preferences to find 
                the most compatible opportunities for successful transactions.
              </p>
            </Card>

            <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-workflow text-white text-2xl"></i>
              </div>
              <h3 className="font-poppins text-2xl font-semibold text-primary-900 mb-4">Streamlined Process</h3>
              <p className="text-slate-600 leading-relaxed">
                Automated milestone tracking, document management, and deal progression tools that 
                simplify the acquisition process from start to finish.
              </p>
            </Card>

            <Card className="glassmorphism bg-white/80 p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="font-poppins text-2xl font-semibold text-primary-900 mb-4">User Control</h3>
              <p className="text-slate-600 leading-relaxed">
                Sellers maintain full control over their engagement process, choosing which buyers 
                to connect with for more meaningful business discussions.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-success-600">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="font-poppins text-4xl lg:text-5xl font-bold text-white mb-8">
            Start Your Business Journey
          </h2>
          <p className="text-xl text-primary-100 mb-12">
            Connect with the right opportunities and streamline your business acquisition process.
          </p>
          <Button 
            size="lg"
            onClick={handleLogin}
            className="bg-white text-primary-600 hover:bg-gray-50 px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            data-testid="button-join-now"
          >
            Join Platform
            <i className="fas fa-arrow-right ml-3"></i>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-success-400 rounded-lg flex items-center justify-center">
                <i className="fas fa-handshake text-white text-sm"></i>
              </div>
              <span className="font-poppins font-bold text-xl">Business Platform</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary-300 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-300 transition-colors">Terms</a>
              <a href="#" className="hover:text-primary-300 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
