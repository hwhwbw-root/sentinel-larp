import React from "react";
import { Cpu, Monitor, Radio, ShieldCheck, ArrowRight, Bell, FileSpreadsheet } from "lucide-react";
import { AnimatedText, StaggeredMotion } from "remotion-bits";
import { APPLE_FONT_FAMILY } from "../apple-theme";
import { SentinelAtmosphere } from "../components/SentinelAtmosphere";

export const ArchitectureBentoScene: React.FC = () => {
  return (
    <div
      className="relative w-full h-full bg-[#fbfbfd] flex flex-col items-center justify-between px-16 py-14 overflow-hidden select-none"
      style={{ fontFamily: APPLE_FONT_FAMILY }}
    >
      {/* Subtle Ambient Atmosphere */}
      <SentinelAtmosphere intensity={0.5} />

      {/* Background Soft Glow */}
      <div
        className="absolute w-[1100px] h-[500px] rounded-full pointer-events-none"
        style={{
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse at center, rgba(47, 111, 237, 0.05) 0%, rgba(251, 251, 253, 0) 70%)",
        }}
      />

      {/* HEADER: Clean, direct pitch without "System Architecture" label */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center text-center">
        <AnimatedText
          className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-2 text-center"
          transition={{
            y: [20, 0],
            blur: [6, 0],
            opacity: [0, 1],
            delay: 8,
            duration: 22,
            easing: "easeOutCubic",
          }}
        >
          Two parts. One complete safety system.
        </AnimatedText>

        <AnimatedText
          className="text-base text-zinc-500 max-w-2xl text-center font-normal"
          transition={{
            y: [15, 0],
            opacity: [0, 1],
            delay: 18,
            duration: 25,
            easing: "easeOutCubic",
          }}
        >
          Autonomous hardware protects the room locally. The central web dashboard protects your entire facility.
        </AnimatedText>
      </div>

      {/* 2-PILLAR SYSTEM SHOWCASE */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-12 gap-6 items-center my-auto">
        {/* PILLAR 1: THE PHYSICAL ON-WALL SENSOR UNIT (Cols 1-5) */}
        <div className="col-span-5 bg-white rounded-3xl border border-zinc-200/80 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between h-[390px] relative overflow-hidden group">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2f6fed]" />

          <div>
            {/* Device Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#2f6fed]/10 flex items-center justify-center text-[#2f6fed]">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Sentinel Sensor Unit</div>
                  <div className="text-[11px] text-zinc-400 font-mono">MODEL SN-400 // WALL MOUNT</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STANDALONE
              </span>
            </div>

            {/* Embedded Realistic Hardware OLED Display */}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 shadow-inner mb-4 font-mono text-xs">
              <div className="flex justify-between items-center text-zinc-400 text-[10px] pb-2 border-b border-zinc-800">
                <span>BAY 01 // ROOM AIR</span>
                <span className="text-emerald-400 font-bold">SAFE</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">CO₂ Level</div>
                  <div className="text-xl font-black text-white">524 <span className="text-xs font-normal text-zinc-400">PPM</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase">H₂ Concentration</div>
                  <div className="text-xl font-black text-cyan-400">0.00 <span className="text-xs font-normal text-zinc-400">%</span></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-zinc-500 text-[10px] pt-2 mt-2 border-t border-zinc-800/80">
                <span>TEMP: 24.4°C</span>
                <span>HUMIDITY: 48%</span>
              </div>
            </div>

            {/* Hardware Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2f6fed]" />
                <span className="font-semibold text-zinc-900">Dual-gas optical chamber:</span> Real-time CO₂ &amp; H₂
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-semibold text-zinc-900">85 dB Piezo Siren:</span> Alarms even if WiFi drops
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span>Power: 24V / PoE / USB-C</span>
            <span>Zero calibration drift</span>
          </div>
        </div>

        {/* CENTER: REALTIME BRIDGE CONNECTOR (Cols 6-7) */}
        <div className="col-span-2 flex flex-col items-center justify-center px-2">
          <div className="w-full flex items-center justify-center relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-[#2f6fed] via-[#2f6fed]/80 to-emerald-500" />
            <div className="absolute w-8 h-8 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center text-[#2f6fed]">
              <ArrowRight size={14} className="animate-pulse" />
            </div>
          </div>
          <div className="mt-3 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-600 font-semibold tracking-wide">
            &lt; 500ms LIVE SYNC
          </div>
          <div className="text-[10px] text-zinc-400 text-center mt-1">
            Secure WebSocket Link
          </div>
        </div>

        {/* PILLAR 2: THE CENTRAL SAFETY CONSOLE (Cols 8-12) */}
        <div className="col-span-5 bg-white rounded-3xl border border-zinc-200/80 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between h-[390px] relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />

          <div>
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Monitor size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">Central Web Console</div>
                  <div className="text-[11px] text-zinc-400 font-mono">SAFETY PORTAL // UNLIMITED USERS</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                ALL SYSTEMS GO
              </span>
            </div>

            {/* Dashboard Multi-Room Preview */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200/70 space-y-2 mb-4">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-zinc-800">Bay 01 - Main Production</span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900">524 ppm CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-zinc-800">Bay 02 - Chemical Storage</span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900">480 ppm CO₂</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-zinc-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-zinc-800">Bay 03 - Battery Lab</span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-900">0.00% H₂</span>
              </div>
            </div>

            {/* Dashboard Highlights */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <Bell size={13} className="text-[#2f6fed]" />
                <span className="font-semibold text-zinc-900">Instant Team Alerts:</span> Browser notifications &amp; email
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <FileSpreadsheet size={13} className="text-emerald-600" />
                <span className="font-semibold text-zinc-900">Safety Compliance:</span> Automatic 24/7 history &amp; 1-click CSV
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span>Any device: Desktop / Tablet / Phone</span>
            <span>Unlimited rooms</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SPEC BAR: Clear, tangible value */}
      <StaggeredMotion
        className="relative z-10 w-full max-w-5xl grid grid-cols-3 gap-6"
        transition={{
          opacity: [0, 1],
          y: [15, 0],
          delay: 35,
          duration: 22,
          stagger: 5,
          easing: "easeOutCubic",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-zinc-200/70 shadow-xs">
          <ShieldCheck size={18} className="text-[#2f6fed] shrink-0" />
          <div className="text-xs font-medium text-zinc-700">
            <strong className="text-zinc-900">Continuous Protection:</strong> Failsafe alarm runs locally
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-zinc-200/70 shadow-xs">
          <Radio size={18} className="text-amber-500 shrink-0" />
          <div className="text-xs font-medium text-zinc-700">
            <strong className="text-zinc-900">Sub-Second Sync:</strong> Instant alerts across every screen
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-zinc-200/70 shadow-xs">
          <FileSpreadsheet size={18} className="text-emerald-600 shrink-0" />
          <div className="text-xs font-medium text-zinc-700">
            <strong className="text-zinc-900">1-Click CSV Export:</strong> Audit-ready logs on demand
          </div>
        </div>
      </StaggeredMotion>
    </div>
  );
};
