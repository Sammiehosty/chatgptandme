import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { getSettings, type AppSettings } from '../api';

export default function ContactPage() {
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(s => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">Contact Us</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          {settings.contact_description || "We'd love to hear from you. Reach out to us through any of the channels below."}
        </p>
      </div>

      {/* Map */}
      {settings.contact_map_iframe && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-white/10 bg-slate-800/50">
          <div 
            className="w-full h-64 sm:h-80"
            dangerouslySetInnerHTML={{ __html: settings.contact_map_iframe }}
          />
        </div>
      )}

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Phone 1 */}
        {settings.contact_phone1 && (
          <a
            href={`tel:${settings.contact_phone1.replace(/\s/g, '')}`}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Phone</p>
              <p className="text-lg font-semibold text-white">{settings.contact_phone1}</p>
            </div>
          </a>
        )}

        {/* Phone 2 */}
        {settings.contact_phone2 && (
          <a
            href={`tel:${settings.contact_phone2.replace(/\s/g, '')}`}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Phone 2</p>
              <p className="text-lg font-semibold text-white">{settings.contact_phone2}</p>
            </div>
          </a>
        )}
      </div>

      {/* Additional Info */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Address */}
        {settings.contact_address && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Address</p>
              <p className="text-sm text-slate-300 leading-relaxed">{settings.contact_address}</p>
            </div>
          </div>
        )}

        {/* Service Times */}
        {settings.worship_text && (
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Service Times</p>
              <p className="text-sm text-slate-300 leading-relaxed">{settings.worship_text}</p>
            </div>
          </div>
        )}
      </div>

      {/* Get Direction Button */}
      {settings.direction_link && (
        <div className="mt-8 text-center">
          <a
            href={settings.direction_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5"
          >
            <MapPin className="w-5 h-5" />
            {settings.direction_button_text || 'Get Direction'}
          </a>
        </div>
      )}
    </div>
  );
}
