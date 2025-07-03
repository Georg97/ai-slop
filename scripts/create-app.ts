#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

interface AppConfig {
  apps: Array<{
    name: string;
    description: string;
    path: string;
    port: number;
    status: string;
  }>;
}

async function createApp(): Promise<void> {
  try {
    // Get app name from command line or prompt
    const appName = process.argv[2] || await question('Enter app name: ');
    
    if (!appName) {
      console.error('❌ App name is required');
      process.exit(1);
    }

    // Validate app name
    if (!/^[a-z][a-z0-9-]*$/.test(appName)) {
      console.error('❌ App name must start with a letter and contain only lowercase letters, numbers, and hyphens');
      process.exit(1);
    }

    const appDir = path.join(process.cwd(), 'apps', appName);
    
    // Check if app already exists
    if (fs.existsSync(appDir)) {
      console.error(`❌ App '${appName}' already exists`);
      process.exit(1);
    }

    console.log(`🚀 Creating new app: ${appName}`);

    // Create app directory
    fs.mkdirSync(appDir, { recursive: true });

    // Initialize T3 app
    console.log('📦 Initializing T3 stack...');
    process.chdir(appDir);
    
    execSync(`pnpm create t3-app@latest . --CI --nextAuth --prisma --tailwind --trpc --default`, {
      stdio: 'inherit'
    });

    // Install additional required dependencies
    console.log('📦 Installing additional dependencies...');
    const dependencies = [
      'zustand',
      '@tanstack/react-query',
      '@tanstack/react-table',
      'react-hook-form',
      '@hookform/resolvers',
      'zod'
    ];
    
    const devDependencies = [
      '@types/node'
    ];

    execSync(`pnpm add ${dependencies.join(' ')}`, { stdio: 'inherit' });
    execSync(`pnpm add -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });

    // Install shadcn/ui
    console.log('🎨 Setting up shadcn/ui...');
    execSync(`pnpm dlx shadcn-ui@latest init --yes`, { stdio: 'inherit' });

    // Get app details from user
    console.log('\n📝 Let\'s configure your app...');
    
    const appDescription = await question('Enter app description: ');
    const appPurpose = await question('What is the main purpose of this app? ');
    const databaseType = await question('Database type (sqlite/postgresql) [sqlite]: ') || 'sqlite';
    const authType = await question('Authentication type (nextauth/custom/none) [nextauth]: ') || 'nextauth';
    const externalApis = await question('External APIs (comma-separated, or none): ') || 'none';
    const specialDeps = await question('Special dependencies (comma-separated, or none): ') || 'none';

    // Copy and customize CLAUDE.md template
    const templatePath = path.join(process.cwd(), '..', '..', 'templates', 'CLAUDE.md.template');
    const claudeMdPath = path.join(appDir, 'CLAUDE.md');
    
    let claudeContent = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders
    const replacements = {
      '{{APP_NAME}}': appName,
      '{{APP_DESCRIPTION}}': appDescription,
      '{{APP_PURPOSE}}': appPurpose,
      '{{APP_STATUS}}': 'Development',
      '{{APP_PORT}}': '3000',
      '{{DEPLOYMENT_URL}}': 'TBD',
      '{{DATABASE_TYPE}}': databaseType,
      '{{AUTH_TYPE}}': authType,
      '{{EXTERNAL_APIS}}': externalApis,
      '{{SPECIAL_DEPS}}': specialDeps,
      '{{DATABASE_SCHEMA}}': 'To be defined',
      '{{QUERY_ENDPOINTS}}': 'To be defined',
      '{{MUTATION_ENDPOINTS}}': 'To be defined',
      '{{PAGES_LIST}}': 'To be defined',
      '{{COMPONENTS_LIST}}': 'To be defined',
      '{{DATABASE_URL}}': databaseType === 'sqlite' ? 'file:./db.sqlite' : 'postgresql://...',
      '{{NEXTAUTH_SECRET}}': 'your-secret-here',
      '{{NEXTAUTH_URL}}': 'http://localhost:3000',
      '{{EXTERNAL_API_KEYS}}': 'Add your API keys here',
      '{{CORE_FEATURES}}': 'To be defined',
      '{{PLANNED_FEATURES}}': 'To be defined',
      '{{IMPLEMENTATION_STATUS}}': 'Initial setup complete',
      '{{KNOWN_ISSUES}}': 'None',
      '{{TECHNICAL_DECISIONS}}': 'Using T3 stack with ' + databaseType,
      '{{PERFORMANCE_NOTES}}': 'To be evaluated',
      '{{UNIT_TESTS}}': 'To be implemented',
      '{{INTEGRATION_TESTS}}': 'To be implemented',
      '{{MANUAL_TESTING}}': 'To be defined',
      '{{PRODUCTION_ENV_VARS}}': 'To be defined',
      '{{DEPLOYMENT_NOTES}}': 'Deploy via Vercel',
      '{{DEPENDENCIES_TO_MONITOR}}': 'All major dependencies',
      '{{REGULAR_TASKS}}': 'Update dependencies, monitor performance',
      '{{BACKUP_STRATEGY}}': 'Database backups for production'
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      claudeContent = claudeContent.replace(new RegExp(placeholder, 'g'), value);
    });

    fs.writeFileSync(claudeMdPath, claudeContent);

    // Create apps-config.json if it doesn't exist
    const appsConfigPath = path.join(process.cwd(), '..', '..', 'apps-config.json');
    let appsConfig: AppConfig = { apps: [] };
    
    if (fs.existsSync(appsConfigPath)) {
      appsConfig = JSON.parse(fs.readFileSync(appsConfigPath, 'utf8')) as AppConfig;
    }

    // Add new app to config
    appsConfig.apps.push({
      name: appName,
      description: appDescription,
      path: `apps/${appName}`,
      port: 3000,
      status: 'development'
    });

    fs.writeFileSync(appsConfigPath, JSON.stringify(appsConfig, null, 2));

    console.log(`\n✅ App '${appName}' created successfully!`);
    console.log(`\n📋 Next steps:`);
    console.log(`   1. cd apps/${appName}`);
    console.log(`   2. pnpm install`);
    console.log(`   3. pnpm dev`);
    console.log(`   4. Open http://localhost:3000`);
    console.log(`   5. Edit CLAUDE.md to add more details`);
    console.log(`\n📄 Don't forget to read the CLAUDE.md file in your app directory!`);

  } catch (error) {
    console.error('❌ Error creating app:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    rl.close();
  }
}

createApp();