import { JwtModule } from "@nestjs/jwt";

export const jwtConstants = {
  secret:
    "DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.",
};

export const JwtImport = JwtModule.register({
  secret: jwtConstants.secret,
  signOptions: { expiresIn: "7d" },
});
