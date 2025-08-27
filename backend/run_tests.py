#!/usr/bin/env python3
"""
Script para executar testes automatizados do backend.
"""

import subprocess
import sys
import os


def run_command(command, description):
    """Executa um comando e exibe o resultado."""
    print(f"\n{'='*60}")
    print(f"🚀 {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao executar: {e}")
        print(f"Stderr: {e.stderr}")
        return False


def main():
    """Função principal para executar os testes."""
    print("🧪 Executando Testes Automatizados do Backend")
    print("=" * 60)
    
    # Verificar se estamos no diretório correto
    if not os.path.exists("pyproject.toml"):
        print("❌ Erro: Execute este script no diretório backend/")
        sys.exit(1)
    
    # Instalar dependências de desenvolvimento
    print("\n📦 Instalando dependências de desenvolvimento...")
    if not run_command("poetry install", "Instalando dependências com Poetry"):
        print("❌ Falha ao instalar dependências")
        sys.exit(1)
    
    # Executar testes com cobertura
    print("\n🧪 Executando testes com cobertura...")
    if not run_command("poetry run pytest --cov=api --cov-report=term-missing --cov-report=html", "Executando testes com cobertura"):
        print("❌ Falha ao executar testes")
        sys.exit(1)
    
    # Executar testes específicos por categoria
    print("\n🔍 Executando testes unitários...")
    run_command("poetry run pytest tests/unit/ -v", "Testes Unitários")
    
    print("\n🔍 Executando testes de integração...")
    run_command("poetry run pytest tests/integration/ -v", "Testes de Integração")
    
    # Executar testes com marcadores específicos
    print("\n⚡ Executando testes rápidos (sem marcadores)...")
    run_command("poetry run pytest -m 'not slow' -v", "Testes Rápidos")
    
    print("\n📊 Gerando relatório de cobertura...")
    run_command("poetry run pytest --cov=api --cov-report=html", "Relatório de Cobertura HTML")
    
    print("\n✅ Testes concluídos com sucesso!")
    print("\n📁 Relatórios gerados:")
    print("   - Cobertura HTML: htmlcov/index.html")
    print("   - Cobertura XML: .coverage.xml")
    print("\n🎯 Para executar testes específicos:")
    print("   - Testes unitários: poetry run pytest tests/unit/")
    print("   - Testes de integração: poetry run pytest tests/integration/")
    print("   - Testes com cobertura: poetry run pytest --cov=api")
    print("   - Testes específicos: poetry run pytest -k 'test_name'")


if __name__ == "__main__":
    main() 