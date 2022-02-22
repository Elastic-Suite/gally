<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220216105843 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE catalog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE catalog (id INT NOT NULL, website_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, locale VARCHAR(5) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1B2C324777153098 ON catalog (code)');
        $this->addSql('CREATE INDEX IDX_1B2C324718F45C82 ON catalog (website_id)');
        $this->addSql('CREATE SEQUENCE website_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE website (id INT NOT NULL, code VARCHAR(255) NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_476F5DE777153098 ON website (code)');
        $this->addSql('ALTER TABLE catalog ADD CONSTRAINT FK_1B2C324718F45C82 FOREIGN KEY (website_id) REFERENCES website (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE catalog DROP CONSTRAINT FK_1B2C324718F45C82');
        $this->addSql('DROP SEQUENCE catalog_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE website_id_seq CASCADE');
        $this->addSql('DROP TABLE catalog');
        $this->addSql('DROP TABLE website');
    }
}
