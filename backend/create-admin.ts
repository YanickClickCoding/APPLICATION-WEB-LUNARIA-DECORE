import { NestFactory } from '@nestjs/core'
import { AppModule } from './src/app.module'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { UserDocument } from './src/common/schemas/user.schema'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const userModel = app.get<Model<UserDocument>>(getModelToken('User'))

  const email = 'admin@lunaria.com'
  const password = 'adminPassword123'
  
  // Vérifier si l'admin existe déjà
  const existingAdmin = await userModel.findOne({ email })
  
  if (existingAdmin) {
    console.log('✅ Un administrateur existe déjà avec cet email.')
  } else {
    // Création de l'administrateur
    const hashedPassword = await bcrypt.hash(password, 10)
    await userModel.create({
      firstName: 'Admin',
      lastName: 'Lunaria',
      email: email,
      phone: '+229 00 00 00 00', // Format requis par le schéma
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      isVerified: true,
    })
    console.log('🚀 Compte Administrateur créé avec succès !')
    console.log(`Email : ${email}`)
    console.log(`Mot de passe : ${password}`)
  }

  await app.close()
  process.exit(0)
}

bootstrap()
