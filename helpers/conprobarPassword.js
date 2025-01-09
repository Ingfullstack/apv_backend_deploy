import bcrypt from 'bcrypt';

export const conprobarPassword = async ( passwordFormulario, passwordHash) => {
    return await bcrypt.compare(passwordFormulario, passwordHash);
}