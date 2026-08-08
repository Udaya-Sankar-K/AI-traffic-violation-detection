import re

path = r'C:\Users\balau\.gemini\antigravity\scratch\traffic-violation-system\src\pages\LandingPage.jsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Font
code = code.replace("fontFamily: 'Inter'", "fontFamily: 'Poppins'")

# 1. Particles & Orbs
code = re.sub(r'// Floating particle.*?// Feature Card', '// Feature Card', code, flags=re.DOTALL)
code = re.sub(r'<div style=\{\{\s*position: \'absolute\', top: \'-20%\'.*?pointerEvents: \'none\',\s*\}\} />', '', code, flags=re.DOTALL)
code = re.sub(r'<div style=\{\{\s*position: \'absolute\', bottom: \'-20%\'.*?pointerEvents: \'none\',\s*\}\} />', '', code, flags=re.DOTALL)
code = re.sub(r'\{\[\.\.\.Array\(12\)\].map\(\(_, i\) => \(\s*<Particle.*?/>\s*\)\)\}', '', code, flags=re.DOTALL)
code = re.sub(r'<div className="grid-bg".*?/>', '', code)
code = code.replace('className="animate-float"', '')

# 2. Colors & Styles in Components
# Feature Card
code = re.sub(
    r"background: 'rgba\(255,255,255,0\.03\)',\s*border: `1px solid rgba\(255,255,255,0\.08\)`",
    "background: '#FFFFFF', border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)'",
    code
)
code = code.replace("color: '#F8FAFC', marginBottom: 8, fontFamily: 'Poppins'", "color: '#202421', marginBottom: 8, fontFamily: 'Poppins'")
code = code.replace("color: '#94A3B8', lineHeight: 1.7", "color: '#5A6060', lineHeight: 1.7")
# Step Card
code = code.replace("background: 'linear-gradient(135deg, #2563EB, #06B6D4)'", "background: '#287C78'")
code = code.replace("boxShadow: '0 8px 25px rgba(37,99,235,0.35)'", "boxShadow: '0 2px 8px rgba(40,124,120,0.15)'")
code = code.replace("background: '#0F172A'", "background: '#FFFFFF'")
code = code.replace("border: '2px solid #2563EB'", "border: '2px solid #287C78'")
code = code.replace("color: '#2563EB'", "color: '#287C78'")

# FAQ Item
code = code.replace("background: open ? 'rgba(37,99,235,0.05)' : 'rgba(255,255,255,0.02)'", "background: open ? 'rgba(40,124,120,0.08)' : '#FFFFFF'")
code = code.replace("border: '1px solid rgba(255,255,255,0.07)'", "border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)'")
code = code.replace('color="#64748B"', 'color="#5A6060"')

# Main Container
code = code.replace("background: '#0F172A', minHeight:", "background: '#F7F6F2', minHeight:")

# Radar Visualization
code = code.replace("rgba(37,99,235,", "rgba(40,124,120,")
code = code.replace("linear-gradient(90deg, #2563EB, transparent)", "linear-gradient(90deg, #287C78, transparent)")
code = code.replace("boxShadow: '0 0 20px rgba(37,99,235,0.8)'", "boxShadow: '0 2px 8px rgba(40,124,120,0.15)'")
code = code.replace("color: '#EF4444'", "color: '#C94C4C'")
code = code.replace("color: '#F97316'", "color: '#C9824B'")
code = code.replace("color: '#22C55E'", "color: '#287C78'")
code = code.replace("background: 'rgba(2,6,23,0.9)'", "background: '#FFFFFF'")

# Badges and Labels
code = code.replace("background: 'rgba(37,99,235,0.1)'", "background: 'rgba(40,124,120,0.08)'")
code = code.replace("border: '1px solid rgba(37,99,235,0.3)'", "border: '1px solid rgba(40,124,120,0.2)'")
code = code.replace("background: '#22C55E'", "background: '#287C78'") # Active indicators
code = code.replace("color: '#06B6D4'", "color: '#287C78'")

# Gradient texts -> solid teal
code = re.sub(r'className="gradient-text(-warm)?"', r'style={{ color: \'#287C78\' }}', code)

# Features & Tech Stack colors
code = code.replace("'#2563EB'", "'#287C78'")
code = code.replace("'#06B6D4'", "'#287C78'")
code = code.replace("'#22C55E'", "'#287C78'")
code = code.replace("'#8B5CF6'", "'#287C78'")
code = code.replace("'#F59E0B'", "'#287C78'")
code = code.replace("'#EC4899'", "'#287C78'")
code = code.replace("'#EF4444'", "'#C94C4C'")
code = code.replace("'#F97316'", "'#C9824B'")
code = code.replace("'#DC2626'", "'#C94C4C'")
code = code.replace("'#10B981'", "'#287C78'")

# Sections specific changes (Hero, etc.)
# Hero Stats Row
code = code.replace("borderTop: '1px solid rgba(255,255,255,0.06)'", "borderTop: '1px solid rgba(40,124,120,0.15)'")
code = code.replace("color: '#F8FAFC'", "color: '#202421'")
code = code.replace("color: '#64748B'", "color: '#5A6060'")
code = code.replace("color: '#94A3B8'", "color: '#5A6060'")

# Outer glow card of Radar
code = code.replace("background: 'rgba(37,99,235,0.05)'", "background: '#FFFFFF'")
code = code.replace("border: '1px solid rgba(37,99,235,0.15)'", "border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)'")
code = code.replace("background: 'rgba(0,0,0,0.3)'", "background: '#F7F6F2'")

# Floating violation cards
code = code.replace("background: 'rgba(239,68,68,0.1)'", "background: 'rgba(201,76,76,0.1)'")
code = code.replace("border: '1px solid rgba(239,68,68,0.3)'", "border: '1px solid rgba(201,76,76,0.25)'")
code = code.replace("background: 'rgba(34,197,94,0.08)'", "background: 'rgba(40,124,120,0.08)'")
code = code.replace("border: '1px solid rgba(34,197,94,0.25)'", "border: '1px solid rgba(40,124,120,0.2)'")

# System Capabilities Bar
code = code.replace("background: 'rgba(37,99,235,0.05)'", "background: 'rgba(40,124,120,0.06)'")
code = code.replace("borderTop: '1px solid rgba(37,99,235,0.1)'", "borderTop: '1px solid rgba(40,124,120,0.15)'")
code = code.replace("borderBottom: '1px solid rgba(37,99,235,0.1)'", "borderBottom: '1px solid rgba(40,124,120,0.15)'")

# Platform Features
code = code.replace("background: 'rgba(6,182,212,0.08)'", "background: 'rgba(40,124,120,0.08)'")
code = code.replace("border: '1px solid rgba(6,182,212,0.2)'", "border: '1px solid rgba(40,124,120,0.2)'")

# How It Works
code = code.replace("background: 'linear-gradient(180deg, transparent, rgba(37,99,235,0.04), transparent)'", "background: '#F7F6F2'")
code = code.replace("background: 'rgba(255,255,255,0.02)'", "background: '#FFFFFF'")
code = code.replace("border: '1px solid rgba(255,255,255,0.08)'", "border: '1px solid rgba(32,36,33,0.1)', boxShadow: '0 1px 4px rgba(32,36,33,0.08)'")
code = code.replace("background: 'rgba(2,6,23,0.8)'", "background: '#F7F6F2'")
code = code.replace("background: 'linear-gradient(135deg,#2563EB,#1D4ED8)'", "background: '#287C78'")
code = code.replace("background: 'rgba(255,255,255,0.04)'", "background: '#F7F6F2'")

# Violation Types
code = code.replace("background: 'rgba(249,115,22,0.08)'", "background: 'rgba(201,130,75,0.1)'")
code = code.replace("border: '1px solid rgba(249,115,22,0.2)'", "border: '1px solid rgba(201,130,75,0.25)'")

# Why It Matters
code = code.replace("background: 'rgba(0,0,0,0.2)'", "background: 'rgba(40,124,120,0.04)'")
code = code.replace("background: 'rgba(139,92,246,0.08)'", "background: 'rgba(40,124,120,0.08)'")
code = code.replace("border: '1px solid rgba(139,92,246,0.2)'", "border: '1px solid rgba(40,124,120,0.2)'")

# Demo Request Form
code = code.replace("background: 'rgba(37,99,235,0.04)'", "background: '#F7F6F2'")

# Fix remaining '#F8FAFC' inside the file (mostly headings) to '#202421' except in CTA and Footer
# A safer way to replace is up to the CTA banner
cta_index = code.find('CTA BANNER')
before_cta = code[:cta_index]
after_cta = code[cta_index:]

before_cta = before_cta.replace("'#F8FAFC'", "'#202421'")
before_cta = before_cta.replace("'#94A3B8'", "'#5A6060'")
before_cta = before_cta.replace("'#64748B'", "'#8A9090'")

# Re-assemble
code = before_cta + after_cta

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)
print('Done!')
