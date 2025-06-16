import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';

export async function seedAdmin(dataSource: DataSource) {
    const adminRepo = dataSource.getRepository(Admin);

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    const existingAdmin = await adminRepo.findOne({ where: { username } });

    if (!existingAdmin) {
        const hashed = await bcrypt.hash(password, 10);
        const admin = adminRepo.create({ username, password: hashed });
        await adminRepo.save(admin);
        console.log('Admin criado com sucesso!');
    } else {
        console.log('Admin já existe.');
    }
}
