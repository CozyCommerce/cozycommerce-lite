#!/usr/bin/env node
/**
 * Database Connection Verification Script
 * Verifies Supabase connection and database readiness
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function verifyConnection() {
  console.log('🔍 Verifying Supabase Database Connection...\n');

  try {
    // Test basic connectivity
    console.log('1️⃣  Testing database connectivity...');
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Database connection successful\n');

    // Check environment variables
    console.log('2️⃣  Verifying environment variables...');
    const requiredVars = [
      'DATABASE_URL',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_SECRET',
    ];

    const missingVars = requiredVars.filter((v) => !process.env[v]);
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    } else {
      console.log('✅ All required environment variables are set\n');
    }

    // Check if tables exist
    console.log('3️⃣  Checking database schema...');
    const tables = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

    if (tables.length === 0) {
      console.log('⚠️  No tables found in database');
      console.log('    Run: npm run db:push');
    } else {
      console.log(`✅ Found ${tables.length} tables in database:`);
      tables.forEach((t) => console.log(`   - ${t.tablename}`));
    }

    console.log('\n✅ Database verification complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. npm run db:push        (create tables if needed)');
    console.log('   2. npm run db:seed        (seed demo data)');
    console.log('   3. npm run dev            (start development server)');
  } catch (error) {
    console.error('❌ Database verification failed:');
    console.error(error instanceof Error ? error.message : String(error));

    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check DATABASE_URL in .env.local');
    console.log('   2. Verify Supabase project is running');
    console.log('   3. Ensure password is correct');
    console.log('   4. Try using Supabase Connection Pooler (aws-0-us-east-1.pooler.supabase.com)');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyConnection();
