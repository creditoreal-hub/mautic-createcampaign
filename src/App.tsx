import React, { useState } from 'react';
import { Workflow, Settings, Target } from 'lucide-react';
import CampaignForm from './components/CampaignForm';
import IntegrationSuccess from './components/IntegrationSuccess';
import { IntegrationPayload } from './types/integration';

function App() {
  const [integrationData, setIntegrationData] = useState<IntegrationPayload | null>(null);

  const handleIntegration = (data: IntegrationPayload) => {
    setIntegrationData(data);
  };

  const handleNewIntegration = () => {
    setIntegrationData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-credito-orange-50 via-white to-credito-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="/public/image.png" 
              alt="Logo do Sistema" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-credito-gray-900 mb-4">
            Gerador de campanhas no Mautic
          </h1>
          <p className="text-xl text-credito-gray-700 max-w-2xl mx-auto">
            Crie campanhas e segmentos no Mautic automaticamente com filtros e seleção de público-alvo
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {integrationData ? (
            <IntegrationSuccess 
              data={integrationData} 
              onNewIntegration={handleNewIntegration} 
            />
          ) : (
            <CampaignForm onIntegrate={handleIntegration} />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-credito-orange-200">
          <div className="flex items-center justify-center gap-2 text-credito-gray-600 mb-2">
            <Workflow className="w-4 h-4" />
            <span className="text-sm">Automação de Criação de Campanha - Mautic</span>
          </div>
          <p className="text-xs text-credito-gray-500">
            Tecnologia da Informação - Crédito Real © 2025
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;